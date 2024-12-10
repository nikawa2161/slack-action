interface ImportMetaEnv {
  readonly VITE_SLACK_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
