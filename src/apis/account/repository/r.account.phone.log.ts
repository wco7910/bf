import { g_DataSource } from '../../../ready2start/database';
import { AccountPhoneAuthLog } from '../entity/e.account.phone.auth.log';

export const accountPhoneAuthLogRepository = g_DataSource
  ?.getRepository(AccountPhoneAuthLog)
  .extend({});
