function arrayize (puzzleString){
  const input=puzzleString.split("");
  let data=[
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]
  for(let i=0; i<9;i++){
    for(let j=0;j<9;j++){
      data[i][j]=input[i*9+j];
    }
  }
  //console.log(data);
  //console.log(data[1][0]);
  return data;
}  



class SudokuSolver {
  
  validate(puzzleString) {
    const regex= /[\d|\.]{81}/;
    //console.log(regex.test(puzzleString));
    if(puzzleString.length!==81) return ({error:"Expected puzzle to be 81 characters long"});
      else if (!regex.test(puzzleString)) return ({error:"Invalid characters in puzzle"});
        else return (puzzleString.length===81 && regex.test(puzzleString));
  }

  checkRowPlacement(puzzleString,row,value) {
    
    const data= arrayize(puzzleString);
    

    return (data[row].indexOf(value)===-1 ? true : false);
  }

  checkColPlacement(puzzleString,column, value) {
   
    const data = arrayize(puzzleString);
    const outcome= data.map(elem=> elem[column]===value ? false : true);
    return (outcome.indexOf(false)===-1 ? true : false);
  }

  checkRegionPlacement(puzzleString, index, value) {
    
    const data = arrayize(puzzleString);
    let region=[];

    const x = (Math.floor(index[0]/3))*3;
    const xMax= ((Math.floor(index[0]/3)+1)*3)-1;
    const y = (Math.floor(index[1]/3))*3;
    const yMax= ((Math.floor(index[1]/3)+1)*3)-1;
    for(let i=x;i<=xMax;i++){ 
        for(let j=y;j<=yMax;j++){
          region.push(data[i][j]);
      }
  }
   return (region.indexOf(value)===-1 ? true : false);
  }

  /*solve(puzzleString) {

    let bufferArr=puzzleString.split('');

    for(let i=0;i<9;i++){
      for (let j=0;j<9;j++){
        if(bufferArr[i*9+j]==='.'){
        for( let num=1;num<10;num++){
            
            if(this.checkRowPlacement(puzzleString,i,String(num)) && 
              this.checkColPlacement(puzzleString,j,String(num)) && 
              this.checkRegionPlacement(puzzleString,[i,j],String(num))){
              bufferArr[i*9+j]=num;
              console.log(num);
              puzzleString=bufferArr.join('');
            }
            
        }
        }
      }
    }
    return puzzleString;
  }*/

  solve_mod(puzzleString){
    if(this.validate(puzzleString)===true){
      let bufferArr=puzzleString.split('');
      let empties=[];
      for(let i=0;i<bufferArr.length;i++) if(bufferArr[i]==='.') empties.push(i);
      let solved=false;
    
    
     let emptiesIndex=0;
     let bufferArrIndex=0;
    
    
     do{
        if (emptiesIndex<0) {
          return 'failed to solve';
          break;
        }
        bufferArrIndex=Number(empties[emptiesIndex]);
     
        for(let num= ((bufferArr[bufferArrIndex]==='.') ? 1 : bufferArr[bufferArrIndex]+1); ;num++){
        
       

          if (num===10){
          //backtrack...
         // console.log('backtrack.......');
          bufferArr[bufferArrIndex]='.';
          puzzleString=bufferArr.join('');
          emptiesIndex--;
        
          
           break;
         }
          else {
         // console.log('checking '+'i= '+Math.floor(bufferArrIndex/9)+ ' j= '+bufferArrIndex%9+ ' ' + num);
            if(this.checkRowPlacement(puzzleString,Math.floor(bufferArrIndex/9),String(num)) && 
              this.checkColPlacement(puzzleString,bufferArrIndex%9,String(num)) &&
              this.checkRegionPlacement(puzzleString,[Math.floor(bufferArrIndex/9),bufferArrIndex%9],String(num))){
               bufferArr[bufferArrIndex]=num;
              //lastPlacedValue=num;
             // console.log('placed i= '+Math.floor(bufferArrIndex/9)+ ' j= '+bufferArrIndex%9+ ' ' + num);
                puzzleString=bufferArr.join('');
              
               emptiesIndex++;
              
                break;
             }
          }

       }
      
       if(emptiesIndex===empties.length) solved=true;
        
    } while(solved===false)


   
    //console.log(puzzleString);
    return puzzleString;
  } else return (this.validate(puzzleString));
  }
}

module.exports = SudokuSolver;

