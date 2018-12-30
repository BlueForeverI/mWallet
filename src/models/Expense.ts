export class Expense {
  constructor(public id: string,
              public amount: number,
              public categoryId: string,
              public userId: string,
              public date: Date) {}
}
