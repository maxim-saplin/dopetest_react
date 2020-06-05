const rand = {
  MBIG : 2000000000,
  MSEED : 161803398,
  SeedArray : new Array(56),
  inext : null,
  inextp : null,
  init : function(Seed) {
       let ii;
       let mj, mk;

       let subtraction = Math.abs(Seed);
       mj = this.MSEED - subtraction;
       this.SeedArray[55] = mj;
       mk = 1;
       for (let i = 1; i < 55; i++)
       {  
           ii = (21 * i) % 55;
           this.SeedArray[ii] = mk;
           mk = mj - mk;
           if (mk < 0) mk += this.MBIG;
           mj = this.SeedArray[ii];
       }
       for (let k = 1; k < 5; k++)
       {
           for (let i = 1; i < 56; i++)
           {
               this.SeedArray[i] -= this.SeedArray[1 + (i + 30) % 55];
               if (this.SeedArray[i] < 0) this.SeedArray[i] += this.MBIG;
           }
       }
       this.inext = 0;
       this.inextp = 21;
   },
   InternalSample : function() {
       let retVal;
       let locINext = this.inext;
       let locINextp = this.inextp;

       if (++locINext >= 56) locINext = 1;
       if (++locINextp >= 56) locINextp = 1;

       retVal = this.SeedArray[locINext] - this.SeedArray[locINextp];

       if (retVal === this.MBIG) retVal--;
       if (retVal < 0) retVal += this.MBIG;

       this.SeedArray[locINext] = retVal;

       this.inext = locINext;
       this.inextp = locINextp;

       return retVal;
   },
   next : function() {
     return (this.InternalSample() * (1.0 / this.MBIG));
   }
}

export default rand;