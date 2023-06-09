import { auth } from "./firebase";

const AuthenticationService = {
  async isLoggedIn() {
    const user = await auth().currentUser;
    return !!user;
  },

  observeStatus(callback: any) {
    auth().onAuthStateChanged(callback);
  },

  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    return auth()
      .signInWithPopup(provider)
      .then((res: any) => {
        const token = res.credential.accessToken;
        const user = res.user;

        return {
          token,
          user,
        };
      });
  },
};

export default AuthenticationService;
