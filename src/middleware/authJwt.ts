// import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
// //---------------------------------------------------------------------------------------------------
// // 비밀키정의
export const SECRETORKEY: string = String(process.env.SECRET_KEY).trim(); // 15자
// // #####################################################################################################
// // express의 보안관련 설정 초기화를 위한 함수
// // 여러개의 전략을 사용할 수 있음
const initAuthJwt = (app: any) => {
  passport.use(
    'jwt', // passport 에서 호출한 전략명
    new JwtStrategy(
      {
        // jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        // jwtFromRequest: ExtractJwt.fromHeader('Authorization'), //
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRETORKEY,
      },
      // eslint-disable-next-line consistent-return
      (jwtPayload, done) => {
        console.log('[JWT Payload] ', jwtPayload);
        /*
        [done 함수]
        첫 번째 인자는 DB조회 같은 때 발생하는 서버 에러. 무조건 실패하는 경우에만 사용
        두 번째 인자는 성공했을 때 return할 값을 넣는 곳 : 보통 계정 정보 넘겨줌 (세션에서 사용할 값)
        세 번째 인자는 사용자가 임의로 실패를 만들고 싶을 때 사용: 예) 비밀번호가 틀렸다는 에러를 표현하고 싶을 때 사용
        --> req.authInfo에 값이 저장됨
        */
        const { exp } = jwtPayload;
        // 기한 확인
        if (Date.now() >= exp * 1000) {
          return done(null, { message: 'auth expired' });
        }
        // 두번재 파라미터는 authJwt에 저장됨--> 기본값은 _userProperty: user, 임의로 설정가능
        // 세번째 파라미터는 authInfo:{} 에저장되는 값
        done(
          null,
          { authToken: null, accessToken: null }, // authToken,accessToken로 하여 클라이언트값을 사용하도록 함
          { message: 'auth success' }
        );
      }
    )
  );

  // 초기화
  //  _userProperty: 'user'는 , req.user로 값을 받을 수 있음 <-- 수정가능
  //  기본값은 user임
  app.use(passport.initialize({ userProperty: 'authJwt' }));
  // app.use(passport.initialize());
};

// error TS1208: All files must be modules when the '--isolatedModules' flag is provided.
export default { initAuthJwt };
