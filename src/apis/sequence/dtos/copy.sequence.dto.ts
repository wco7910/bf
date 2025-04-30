import { Sequence } from '../entity/e.sequence';

export class CopySequenceDto extends Sequence {
  constructor(sequence: Sequence) {
    super();
    this.name = '[Copy] ' + sequence.name;
    this.currentOwner = sequence.currentOwner;
    this.intensity = sequence.intensity;
    this.creatorName = sequence.creatorName;
    this.role = sequence.role;
    this.centerName = sequence.centerName;
    this.rounds = sequence.rounds;
    this.totalTime = sequence.totalTime;
    this.roundCount = sequence.roundCount;
    this.intensityNo = sequence.intensityNo;
    this.isCopied = 'T';
    this.isOriginal = sequence.isOriginal;
    this.isPublic = 'F';
    this.playList = sequence.playList;
  }
}
