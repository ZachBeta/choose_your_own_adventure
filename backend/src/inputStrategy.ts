// Strategy interface for dialog input
export interface InputStrategy {
  chooseDialogOption(options: any[]): Promise<number>;
}

export class UserInputStrategy implements InputStrategy {
  prompt: any;
  constructor(prompt: any) {
    this.prompt = prompt;
  }
  async chooseDialogOption(options: any[]): Promise<number> {
    const idx = Number(this.prompt('> choose: '));
    return idx;
  }
}

export class LuigiInputStrategy implements InputStrategy {
  async chooseDialogOption(options: any[]): Promise<number> {
    return 0; // Always select the first option
  }
}
