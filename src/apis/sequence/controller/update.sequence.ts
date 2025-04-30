// import { NextFunction, Request, Response } from 'express';
// import { Sequence } from '../entity/e.sequence';
// import { sequenceRepository } from '../repository/r.sequence';

// export const tags = ['Sequence'];
// export const summary = 'Create Sequence';
// export const request = {
//   path: '/sequence/{sequenceId}',
//   method: 'patch',
// };

// export const dto = 'updateSequence';

// export const params = {
//   path: {
//     sequenceId: {
//       type: 'number',
//       description: '',
//       example: '1',
//     },
//   },
//   query: {},
//   body: {
//     name: {
//       type: 'string',
//       description: '시퀀스의 이름',
//       example: '코어 시퀀스',
//     },
//     totalTime: {
//       type: 'string',
//       description: '시퀀스의 총 시간',
//       example: '370',
//     },
//     playList: {
//       type: 'object',
//       description: '플레이리스트 오브젝트',
//       example: {
//         id: '1',
//       },
//     },
//     intensity: {
//       type: 'string',
//       description: '운동강도 low , normal, high',
//       example: 'normal',
//     },
//     rounds: {
//       type: 'object',
//       description: '라운드들',
//       example: [
//         {
//           type: 'Warmup',
//           title: 'WarmUp',
//           totalTime: '60',
//         },
//         {
//           type: '2',
//           title: 'CCT 3',
//           set: {
//             Acts: 5,
//             Go: '00:20',
//             Repeat: 3,
//             Rest: '00:30',
//           },
//           exercises: [],
//         },
//         {
//           type: '1',
//           title: 'RestBetwwenRounds',
//           totalTime: '60',
//         },
//         {
//           type: '2',
//           title: 'CCT 3',
//           set: {
//             Acts: 5,
//             Go: '00:20',
//             Repeat: 3,
//             Rest: '00:30',
//           },
//           exercises: [],
//         },
//       ],
//     },
//   },
//   form: {},
// };

// export const security = ['ROLE'];

// export const execute = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log('안넘어옴');
//   const data: Sequence = req.body;
//   data.currentOwner = req['user'];
//   let count: number = 0;
//   for (let i = 0; i < req.body.rounds.length; i++) {
//     const round = req.body.rounds[i];
//     if (round.type == '2') {
//       count += parseInt(round.set.Repeat);
//     }
//   }
//   data.creatorName = req['user'].username;
//   data.rounds = JSON.stringify(req.body.rounds);
//   data.isCopied = 'F';
//   data.isOriginal = 'T';
//   data.roundCount = count;
//   data.role = req['user'].role;
//   data.centerName = req['user'].centerName;
//   data.id = Number(req.params.sequenceId);
//   const result = await sequenceRepository.save(
//     // {
//     //   id: Number(req.params.sequenceId),
//     // },
//     data
//   );
//   console.log(data);
//   console.log(result);
//   if (result != null) {
//     return res.status(200).json({
//       message: '업데이트에 성공했습니다.',
//     });
//   }
//   return res.status(400).json({
//     message: '업데이트에 실패 했습니다.',
//   });
// };
// export default execute;
