import { reactive } from "vue";
import { age_1 } from './defines'
class Person {
    private name: string;
    age: number;
    p_name: string;

    constructor(name:string, age: number) {
        this.name = name;
        this.p_name = this.name;
        this.age = age;
    }

    getAge():age_1 {
        return {
            s_age: 10,
            b_age: 20,
            name: this.p_name,
            _ageRange: 'bin'
        }
    }
}

export default reactive(new Person('yanhaha', 30));