import { Sequence } from '../entity/e.sequence';

export class CreateSequenceDto extends Sequence {
  constructor(data, account) {
    let count: number = 0;
    let count_: number = 0;
    for (let i = 0; i < data.rounds.length; i++) {
      const round = data.rounds[i];
      if (round.type == '2') {
        count += parseInt(round.set.Repeat);
      }
      if (round.type == '1') {
        count_ += 1;
      }
    }
    super();
    this.name = data.name;
    this.playList = data.playList;
    this.intensity = data.intensity;
    this.rounds = data.rounds;
    this.restCount = count_;
    this.totalTime = data.totalTime;
    this.roundCount = count;
    this.rounds = data.rounds;
    this.isOriginal = 'T';
    this.intensityNo = data.intensityNo;
    this.currentOwner = account;
    this.centerName = account.centerName;
    this.creatorName = account.username;
    this.role = account.role;
    this.goal = data.goal;
    this.memo = data.memo;
    this.manager = data.manager;
  }
}
