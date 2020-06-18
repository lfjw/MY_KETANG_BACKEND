
class HttpException extends Error {
  constructor(public status: number, public message: string, public errors?: any) {
    // TODO 此处为什么要传递
    // super(message)
    super()
  }
}
export default HttpException;