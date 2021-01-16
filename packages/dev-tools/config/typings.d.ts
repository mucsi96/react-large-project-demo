declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.scss" {
  const classNames: Record<string, string>;
  export = classNames;
}

declare module "*.css" {
  const classNames: Record<string, string>;
  export = classNames;
}
