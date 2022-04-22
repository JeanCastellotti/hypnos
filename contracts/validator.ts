declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    greaterThan(num: number): Rule
  }
}
