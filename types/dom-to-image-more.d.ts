declare module 'dom-to-image-more' {
  interface Options {
    width?: number
    height?: number
    style?: Record<string, string>
    quality?: number
    bgcolor?: string
    cacheBust?: boolean
    imagePlaceholder?: string
    pixelRatio?: number
    filter?: (node: Node) => boolean
  }

  export function toPng(node: Node, options?: Options): Promise<string>
  export function toJpeg(node: Node, options?: Options): Promise<string>
  export function toBlob(node: Node, options?: Options): Promise<Blob>
  export function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>
  export function toSvg(node: Node, options?: Options): Promise<string>
}
