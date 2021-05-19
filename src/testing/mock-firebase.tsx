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
            id: ref.id,
            data: () => ref._data
        }
    }
    return ref._document;
}

const createMockDocumentRef = (data: any) => ({
    _data: data,
    id: '12345678910', 
    get: function (){ return createMockDocument(this) },
    update: function (){ return this }
});

const createMockFireStore = (options?: any) => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn( function(this: any, id: string) {
        const docData = options?.getDocDataForID(id) || {};
        const updateData = options?.updateDocDataForID || (() => null);
        return {
            ...this,
            id: id,
            _data: docData,
            delete: async () => this,
            update: async (d: any) => {
                updateData(id, d);
                this._data = d;
                return this;
            },
            get: async () => {
                return createMockDocument({id, _data: this._data})
            },
        };
    }),
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

export const resetFirebaseMock = (options?: any) => {
    firestore = createMockFireStore(options);
}