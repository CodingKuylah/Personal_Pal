class CreateBudgetRequest{
    constructor(title, description, total_balance){
        this.title = title;
        this.description = description;
        this.total_balance = total_balance;
    }

    validate(){
        const errors = [];
        if(!this.title){
            errors.push("Title must be filled")
        }
        if(this.title.length < 5){
            errors.push("Title length cannot under 5 words")
        }

        if(this.title.length > 64){
            errors.push("Title max length is 64 words")
        }

        if(this.description.length < 5){
            errors.push("Title length cannot under 5 words")
        }

        if(this.description.length > 350){
            errors.push("Title max length is 350 words")
        }
    return errors;

    }
}

export default CreateBudgetRequest;