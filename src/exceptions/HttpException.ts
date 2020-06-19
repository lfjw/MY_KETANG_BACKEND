


/**
 * error子类
 * 多一个状态码和对象
 * message传递给error
 */
class HttpException extends Error {
  /**
   * 
   * @param status 错误状态码
   * @param message 错误信息
   * @param errors 错误对象
   */
  constructor(public status: number, public message: string, public errors?: any) {
    // TODO 此处为什么要传递
    // super(message)
    super(message)
  }
}
export default HttpException;