import { g_DataSource } from '../ready2start/database';

const pathList = [
  {
    method: 'POST',
    path: '/lecture',
    description: '강의 생성',
  },
  {
    method: 'POST',
    path: '/lecture/download/:lectureId',
    description: '공유된 강의 다운로드',
  },
  {
    method: 'POST',
    path: '/lecture/public/:lectureId',
    description: '강의 공유',
  },
  {
    method: 'POST',
    path: '/tempo',
    description: '템포 생성',
  },
  {
    method: 'POST',
    path: '/sequence',
    description: '시퀀스 생성',
  },
  {
    method: 'POST',
    path: '/sequence/public/:sequenceId',
    description: '시퀀스 공유',
  },
  {
    method: 'POST',
    path: '/sequence/download/:sequenceId',
    description: '시퀀스 다운로드',
  },
];

export const logger = async (params: any) => {
  // console.log(params?.method);
  const index = pathList.findIndex(
    (element: any) =>
      element.path == params.path && element.method == params.method
  );

  if (index != -1) {
    await g_DataSource.getRepository('ActivityLog').save({
      content: pathList[index].description,
      ip: params.user.ip,
      who: params.user.id,
    });
  }
};
