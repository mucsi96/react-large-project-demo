import { setWorldConstructor } from 'dev-tools/intTest';

export class World {
  public mockSwitches = {} as Record<string, string>;

  setMockSwitch(name: string, value: string): void {
    this.mockSwitches[name] = value;
  }

  getMockSwitchesQueryParam(): string {
    return Object.entries(this.mockSwitches)
      .map(([name, value]) => `mock=${name}--${value}`)
      .join('&');
  }
}

setWorldConstructor(World);
