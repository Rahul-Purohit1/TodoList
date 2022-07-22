exports.getDate = function(){  
   const options = { weekday: 'long', year: 'numeric', day: 'numeric' };
    const today = new Date();
    const Currentday = today.toLocaleDateString("en-US", options);
     return  Currentday;

 }

 exports.getDay = function (){    
    const options = { weekday: 'long'}
    const today = new Date();
    const Currentday = today.toLocaleDateString("en-US", options);
    return  Currentday;
 }                               