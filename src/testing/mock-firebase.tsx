const auth = {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    confirmPasswordReset: jest.fn()
} as any;

const createMockFireStore = () => ({
    collection: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: () => ({docs: []}),
    onSnapshot: () => null
});
var firestore = createMockFireStore();

const mockFirebase = {
    name: 'mock-firebase-app',
    auth: () => auth,
    firestore: () => firestore,
};
export default mockFirebase;

export const resetFirebaseMock = () => {
    firestore = createMockFireStore();
}