import * as React from 'react';

export interface WebMCPToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
  debugging?: boolean;
}

export interface WebMCPOptions<Args = Record<string, unknown>, Result = unknown> {
  name: string;
  description: string;
  inputSchema?: object;
  annotations?: WebMCPToolAnnotations;
  execute: (args: Args, options: { signal: AbortSignal }) => Result | Promise<Result>;
  enabled?: boolean;
  formatOutput?: (result: Result, args: Args) => unknown;
  onError?: (error: unknown) => void;
}

export interface WebMCPState {
  supported: boolean;
  registered: boolean;
  error: Error | null;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function toToolResponse(value: unknown) {
  if (value && typeof value === 'object' && Array.isArray((value as any).content)) {
    return value;
  }
  if (value === undefined || value === null) {
    return { content: [] };
  }
  if (typeof value === 'string') {
    return { content: [{ type: 'text', text: value }] };
  }
  return { content: [{ type: 'text', text: JSON.stringify(value) }] };
}

function toErrorResponse(error: unknown) {
  const text =
    error instanceof Error ||
    (error && typeof error === 'object' && typeof (error as any).message === 'string')
      ? (error as any).message
      : typeof error === 'string'
        ? error
        : safeStringify(error);
  return { content: [{ type: 'text', text }], isError: true };
}

export function useWebMCP<Args = Record<string, unknown>, Result = unknown>({
  name,
  description,
  inputSchema,
  annotations,
  execute,
  enabled = true,
  formatOutput,
  onError,
}: WebMCPOptions<Args, Result>): WebMCPState {
  const [state, setState] = React.useState<WebMCPState>({
    supported: false,
    registered: false,
    error: null,
  });

  const executeRef = React.useRef(execute);
  const formatOutputRef = React.useRef(formatOutput);
  const onErrorRef = React.useRef(onError);

  React.useEffect(() => {
    executeRef.current = execute;
    formatOutputRef.current = formatOutput;
    onErrorRef.current = onError;
  });

  const schemaKey = inputSchema ? JSON.stringify(inputSchema) : '';
  const annotationsKey = annotations ? JSON.stringify(annotations) : '';
  const [detectTick, redetect] = React.useReducer((n: number) => n + 1, 0);

  React.useEffect(() => {
    const modelCtx = typeof document !== 'undefined' ? (document as any).modelContext : undefined;
    const supported = Boolean(modelCtx);

    if (!supported) {
      setState({ supported: false, registered: false, error: null });
      if (typeof document === 'undefined') return;
      let attempts = 0;
      const timer = setInterval(() => {
        if ((document as any).modelContext) {
          clearInterval(timer);
          redetect();
        } else if (++attempts >= 20) {
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }

    if (!enabled) {
      setState({ supported: true, registered: false, error: null });
      return;
    }

    const controller = new AbortController();

    try {
      modelCtx.registerTool(
        {
          name,
          description,
          inputSchema,
          annotations,
          async execute(args: Args, options: { signal: AbortSignal }) {
            try {
              const result = await executeRef.current(args, options);
              const format = formatOutputRef.current;
              const shaped = format ? format(result, args) : result;
              if (shaped instanceof Error) throw shaped;
              return toToolResponse(shaped);
            } catch (error) {
              if (onErrorRef.current) {
                onErrorRef.current(error);
              }
              return toErrorResponse(error);
            }
          },
        },
        { signal: controller.signal }
      );

      setState({ supported: true, registered: true, error: null });
    } catch (error) {
      setState({
        supported: true,
        registered: false,
        error: error instanceof Error ? error : new Error(safeStringify(error)),
      });
    }

    return () => {
      controller.abort();
    };
  }, [name, description, schemaKey, annotationsKey, enabled, detectTick]);

  return state;
}
