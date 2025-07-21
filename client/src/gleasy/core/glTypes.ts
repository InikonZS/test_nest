export type GLBufferType = 
    WebGLRenderingContext['BYTE'] | 
    WebGLRenderingContext['SHORT'] |
    WebGLRenderingContext['UNSIGNED_BYTE'] | 
    WebGLRenderingContext['UNSIGNED_SHORT'] |
    WebGLRenderingContext['FLOAT'];

export type GLBufferOptions = {
    target?: WebGLRenderingContext['ARRAY_BUFFER'] | WebGLRenderingContext['ELEMENT_ARRAY_BUFFER'], 
    usage?: WebGLRenderingContext['STATIC_DRAW'] | WebGLRenderingContext['DYNAMIC_DRAW']
}