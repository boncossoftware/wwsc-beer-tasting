const auth = {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    confirmPasswordReset: jest.fn(),
    currentUser: {
        email: 'user@domain.com', 
        uid: '123455678910'
    }
} as any;

const createMockDocument = (ref: any, ) => {
    if (!ref._document) {
        ref._document = {
            data: () => ref._data
        }
    }
    return ref._document;
}

const createMockDocumentRef = (data: any) => ({
    _data: data,
    id: '12345678910', 
    get: function (){ return createMockDocument(this) },
});

const createMockFireStore = () => ({
    collection: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    add: (d: any) => createMockDocumentRef(d),
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