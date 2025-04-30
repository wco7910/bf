// import {
//   EntitySubscriberInterface,
//   EventSubscriber,
//   InsertEvent,
// } from 'typeorm';
// import { ActivityLog } from '../apis/log/entity/e.activity.log';

// @EventSubscriber()
// export class ActivityLogger implements EntitySubscriberInterface<ActivityLog> {
//   beforeInsert(event: InsertEvent<ActivityLog>): void | Promise<any> {
//     console.log('Data will be inserted');
//   }
//   afterInsert(event: InsertEvent<ActivityLog>): void | Promise<any> {
//     console.log('Data was added');
//   }
// }
// export class ExerciseLogger implements EntitySubscriberInterface<ExerciseLogger>{
//     beforeInsert(event: InsertEvent<ExerciseLogger>): void | Promise<any> {
//     }
// }
