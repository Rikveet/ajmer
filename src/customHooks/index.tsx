import React, {useRef, useState} from "react";

export const useLocalStoredState = (key: string, defaultValue: string = '') => {
    const initVal = localStorage.getItem(key) !== null ? localStorage.getItem(key) as string : defaultValue;
    const [value, setValue] = useState<string>(initVal);
    const set = (val: string) => {
        localStorage.setItem(key, val);
        setValue(val);
    }
    return [value, set] as [string, { (val: string): void }]
}

export type ValidatedRef = {ref:React.RefObject<HTMLInputElement>, validate: {():boolean}}
export const useValidatedRef = (validationFunction: { (...args: string[]): boolean },
                                additionalRefs?: React.RefObject<HTMLInputElement>[]) : ValidatedRef => {
    const ref = useRef<HTMLInputElement>(null);
    return {
        ref: ref, validate: () : boolean => {
            if (additionalRefs) {
                const currentValues = additionalRefs.reduce((currentValues: string[], additionalRef: React.RefObject<HTMLInputElement>) => {
                    if (additionalRef.current?.value) {
                        currentValues.push(additionalRef.current.value)
                    }
                    return currentValues
                }, [])
                return (currentValues.length === additionalRefs.length && ref.current?.value && validationFunction(ref.current.value, ...currentValues)) as boolean
            } else {
                return (ref.current?.value && validationFunction(ref.current.value)) as boolean
            }

        }
    }
}
