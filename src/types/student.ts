interface Student {
    id?: number; // ? for optional
    first_name: string;
    last_name: string;
    gender: string;
}

export default Student;
export type StudentInput = Omit<Student, 'id'>;