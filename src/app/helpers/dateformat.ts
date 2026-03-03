export function getFirstDayYear(date: any){
    // let month:any = date.getMonth() + 1;
    let year:any = date.getFullYear();

    // month = month < 10 ? '0'+ month : month;

    return year + "-01" + "-01"
};

export function getFirstDayMonth(date: any){
    let month:any = date.getMonth() + 1;
    let year:any = date.getFullYear();

    month = month < 10 ? '0'+ month : month;

    return year + "-" + month + "-01"
};


export function getEndDayMonth(){
    let month:any = new Date().getMonth() + 1;
    let year:any = new Date().getFullYear();

    return getDate(new Date(year, month, 0))
};

export function getDate(date: any){
    let month:any = new Date(date).getMonth() + 1;
    let day:any =  new Date(date).getDate();
    let year:any =   new Date(date).getFullYear();

    month = month < 10 ? '0'+ month : month;
    day = day < 10 ? '0'+day : day;

    return year + '-' + month + '-' + day
}

export function getDateGB(date: any){
    let month:any = new Date(date).getMonth() + 1;
    let day:any =  new Date(date).getDate();
    let year:any =   new Date(date).getFullYear();

    month = month < 10 ? '0'+ month : month;
    day = day < 10 ? '0'+day : day;

    return  day + '-' + month + '-' + year
}


export function getDateToMilisec(date: any){
    return new Date(date).getTime();
}

export function todayFullDate(){
    let month:any = new Date().getMonth() + 1;
    let day:any =  new Date().getDate();
    let year:any =   new Date().getFullYear();

    month = month < 10 ? '0'+ month : month;
    day = day < 10 ? '0'+day : day;

    return year + '-' + month + '-' + day
}

export function getYesterday(){
    let date = new Date();
    return date.setDate(date.getDate() - 1);
}

export function getCurrentDate(){
    let day:any =  new Date().getDate();
    day = day < 10 ? '0'+day : day;
    return day
}

export function getCurrentMonth(){
    let month:any = new Date().getMonth() + 1;
    return month
}

export function getCurrentYear(){
    let year:any = new Date().getFullYear();
    
    return year
}

export function getLastDateMonth() {
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    return getDate(new Date(year, month, 0));
}