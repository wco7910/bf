import { g_DataSource } from '../../../ready2start/database';
import { SequenceUpload } from '../entity/e.sequence.upload';

export const sequenceUploadRepository = g_DataSource
  ?.getRepository(SequenceUpload)
  .extend({});
