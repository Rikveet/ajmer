import {doc, getDoc, getFirestore, setDoc, updateDoc} from "firebase/firestore";

export type UserInfoT = {
    firstName: string,
    lastName: string,
    email?: string,
    phoneNumber?: string,
    address: string,
    zip: string,
    city: string,
    province: string
}

type DataTypes = UserInfoT
type DocumentAddress = { collection: string, segments: string[] }
type PayloadT = DataTypes
type GetT = Partial<DataTypes> | undefined

abstract class Converter {
    abstract convert(object: Object): GetT
}

export class UserInfoConverter implements Converter {
    convert(object: Object): GetT {
        return object as Partial<UserInfoT>;
    }
}

type ResponseT = {
    res: boolean,
    data?: GetT
    error?: string
}

export const set = async (address: DocumentAddress, payload: PayloadT): Promise<ResponseT> => {
    console.info('set call',address,payload)
    try {
        const db = getFirestore();
        await setDoc(doc(db, address.collection, ...address.segments), payload)
        return {
            res: true
        }
    } catch (e) {
        return {
            res: false,
            error: (e as Error).message
        }
    }
}
export const update = async (address: DocumentAddress, payload: Partial<PayloadT>): Promise<ResponseT> => {
    console.info('update call',address,payload)
    try {
        const db = getFirestore();
        await updateDoc(doc(db, address.collection, ...address.segments), payload)
        return {
            res: true
        }
    } catch (e) {
        return {
            res: false,
            error: (e as Error).message
        }
    }
}

export const get = async (address: DocumentAddress, converter: Converter): Promise<ResponseT> => {
    console.info('get call',address)
    try {
        const db = getFirestore();
        const docRef = doc(db, address.collection, ...address.segments)
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            return {
                res: true,
                data: converter.convert(snapshot.data())
            }
        } else {
            return {
                res: false,
                error: 'No document exists at ' + address.collection + " " + address.segments.join(" ")
            }
        }
    } catch (e) {
        return {
            res: false,
            error: (e as Error).message
        }
    }
}
