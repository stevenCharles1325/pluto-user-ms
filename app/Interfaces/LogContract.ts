export default interface LogContract {
  description: () => Promise<string>
}
