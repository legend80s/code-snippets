// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
interface Person {
    id: number;
    name: string;    
    lastName: string;
    load: () => Promise<Person>;
}

// extract only properties of a given type from Person, for example string
type P = SubType<Person, string>;

const p: P = {
    name: '',
    lastName: '',
};


// Solution
type FilterKey<Base, SubType> = {
    [K in keyof Base]: Base[K] extends SubType ? K : never;
};

type Fx = FilterKey<Person, string>;

type AllowedNames<Base, SubType> = FilterKey<Base, SubType>[keyof Base]

type Ax = AllowedNames<Person, string>;

type SubType<Base, S> = Pick<Base, AllowedNames<Base, S>>

// Solution in one expression

type SubTypeFilter<Base, SubType> = Pick<Base, {
    [K in keyof Base]: Base[K] extends SubType ? K : never
}[keyof Base]>

type P2 = SubTypeFilter<Person, string>;
