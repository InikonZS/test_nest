export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  var shader = gl.createShader(type);   // создание шейдера
  gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
  gl.compileShader(shader);             // компилируем шейдер
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
