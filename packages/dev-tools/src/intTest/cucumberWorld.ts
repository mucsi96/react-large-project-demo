import './snapshot';

export class BaseWorld {
  public mockSwitches = {} as Record<string, string>;

  getStoryUrl(storyId: string): string {
    return `http://localhost:8080/iframe.html?id=${storyId}&no-delay&${this.getMockSwitchesQueryParam()}`;
  }

  setMockSwitch(name: string, value: string): void {
    this.mockSwitches[name] = value;
  }

  private getMockSwitchesQueryParam(): string {
    return Object.entries(this.mockSwitches)
      .map(([name, value]) => `mock=${name}--${value}`)
      .join('&');
  }
}
