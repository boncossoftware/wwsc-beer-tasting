const auth = {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn()
}

const mockFirebase = {
    name: 'mock-firebase-app',
    auth: () => auth
};
export default mockFirebase;