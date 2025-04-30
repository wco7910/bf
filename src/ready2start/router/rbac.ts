/*
Role Based Access Control
*/
const denyList = [
  // USER role deny path '/auth/admin'
  {
    role: 'center',
    path: '/admin',
    // path: '/auth/token',
  },
  {
    role: 'trainer',
    path: '/admin',
  },
  {
    role: 'trainer',
    path: '/center',
  },
];

const rbac = (params: any) => {
  //   console.log('-[rbac]-->', params);
  // console.log(params.path);
  return (
    denyList.findIndex(
      (element: any) =>
        element.role == params?.role && params?.path?.startsWith(element.path)
    ) === -1
  );
};

export default rbac;
