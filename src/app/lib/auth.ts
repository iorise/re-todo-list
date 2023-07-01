import { getAuth, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();


const handleLoginGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    console.log(user);
  } catch (error) {
    console.log("Login error:", error);
  }
};



const handleLogin = async () => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    "nyanpasu@gmail.com",
    "nyanpasu"
  );

  const user = userCredential.user;

  console.log(user);
};

const handleLogout = () => {
    const currentUser = auth.currentUser;
  
    if (currentUser !== null) {
      signOut(auth)
        .then(() => {
          console.log(`Successfully logged out as ${currentUser.email}`);
        })
        .catch((error) => {
          console.log("Logout error:", error);
        });
    } else {
      console.log("No user is currently logged in.");
    }
  };

  const setDisplayName = (displayName: string) => {
    const currentUser = auth.currentUser

    if(currentUser !== null) {
        updateProfile (currentUser, {displayName}).then(() => {
            console.log(`succesfully updated display name to ${displayName}`)
        })
    } else {
        console.log("no user login")
    }
  }

export { handleLogin,handleLoginGoogle, handleLogout, setDisplayName, auth };
