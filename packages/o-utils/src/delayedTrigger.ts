export class DelayedTrigger<TArg>
{
  readonly delay:number;

  private readonly action:(arg?:TArg)=>Promise<void>;

  private lastTrigger?:number;
  private isRunning?:boolean;

  constructor(delay:number, action:(arg?:TArg)=>Promise<void>)
  {
    this.delay = delay;
    this.action = action;
  }

  trigger(arg?:TArg)
  {
    this.lastTrigger = Date.now();
    if (this.isRunning)
    {
      return;
    }

    this.isRunning = true;

    setTimeout(async () =>
    {
      if (this.lastTrigger && this.lastTrigger + this.delay <= Date.now())
      {
        await this.action(arg);
        this.isRunning = false;
      }
      else
      {
        this.isRunning = false;
        this.trigger(arg);
      }
    }, this.delay);
  }
}
