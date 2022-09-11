 //vazão total do sistema
      const qtdSprinkler = document.getElementById("sprinklers");
      const qtdSector = document.getElementById("sector");
      const sectorAtOnce = document.getElementById("sectorAtOnce");
      const sprinklerFlow = document.getElementById("flow");
      const mainPipeLine = document.getElementById("pipeline");
      const sectorLength = document.getElementById("sectorLength");
      const totalSlope = document.getElementById("totalHeigth") //difference in height between the pump and irrigated area
      const workingPressure = document.getElementById("pressure")

      function callAllFunctions(){
        getFlowSector();
        getExtSpeed();
        getMainPipeSpeed();
        getPressureLossMainPipe();
        getPressureLossEx();
        getPressureLossSucction();
        getTotalPressureLoss();
        getIdealPump();
      }
      
      function getFlowSector(){ //here its calculating the flow of the sector only
          sprinkler = qtdSprinkler.value *1;
          sector  = qtdSector.value *1;
          totalSectors = sectorAtOnce.value *1;
          flow = sprinklerFlow.value *1;


          let total = parseInt(sprinkler * flow);
          let totalSectorIrrigated = sprinkler * flow * totalSectors ;
          document.getElementById("flowIndidual").innerHTML = `${total/1000} m3`; //vazão por setor
          document.getElementById("flowAllSectors").innerHTML = `${totalSectorIrrigated/1000} m3`

          return totalSectorIrrigated;

      }

      function getExtSpeed(){ //here its gonna get the speed the water travels in the sector pipes
          let flowPerSecond = (((flow * sprinkler * totalSectors)/3600)/1000).toFixed(5); //remember to change teh scope of the variables in getFlowSector
          let p = document.getElementById("extSpeed");
          const e = document.querySelector(".sectorGauge"); 
          let selectedGauge = ((e.options[e.selectedIndex].value*1)/1000).toFixed(5);
          let middleFormula = Math.pow(selectedGauge,2).toFixed(5);
          let middleFormulaPow = (3.14*middleFormula).toFixed(5) //if i do it like (3,14*gauge) JS will give me strange result

          //Equation =  Q/((3,14*0^2)/4) where q = flow in liters per second and 0 = pipe gauge

          let flowSpeed = (flowPerSecond/(middleFormulaPow/4)).toFixed(2); //calculation for flow speed

          document.getElementById("extSpeed").innerHTML = `${flowSpeed} m/s`;

          if (flowSpeed > 2){
            p.innerHTML = `${flowSpeed} m/s. Aument a bitola. Ideal é 1.6 m/s`;
            p.style.backgroundColor = "red";
          } else if (flowSpeed > 1.6 && flowSpeed <=2){
            p.innerHTML = `${flowSpeed} m/s. Ideal é 1.6 m/s`;
            p.style.backgroundColor = "green";

          } else {
            p.innerHTML = `${flowSpeed} m/s`;
            p.style.backgroundColor = "";
          }


      }

      function getMainPipeSpeed(){
        let sprinkler = qtdSprinkler.value *1;
        let sector  = qtdSector.value *1;
        let flow = sprinklerFlow.value *1;
        let allSectors = sectorAtOnce.value*1;
        const p = document.getElementById("mainPipeSpeed");
        let flowPerSecond = (((flow*sprinkler)/3600)/1000).toFixed(5);

        let totalFlow = sprinkler * allSectors * flow;
        
        const e = document.querySelector(".pipeGauge"); //gauge of the main pipe
        let selectedGauge = ((e.options[e.selectedIndex].value*1)/1000).toFixed(5);
        let middleFormula = Math.pow(selectedGauge,2).toFixed(5);
        let middleFormulaPow = (3.14*middleFormula).toFixed(5) 
        
        let flowSpeedMainPipe = (flowPerSecond/(middleFormulaPow/4)).toFixed(2); //main pipe

          if (flowSpeedMainPipe > 2){
            p.innerHTML = `${flowSpeedMainPipe} m/s. Aumente a bitola. Ideal é 1.6 m/s`;
            p.style.backgroundColor = "red";
          } else if (flowSpeedMainPipe > 1.6 && flowSpeedMainPipe <=2){
            p.innerHTML = `${flowSpeedMainPipe} m/s. Ideal é 1.6 m/s`;
            p.style.backgroundColor = "green";

          } else {
            p.innerHTML = `${flowSpeedMainPipe} m/s`;
            p.style.backgroundColor = "";
          }

          //i will optmize the two functions that handle the speed, put them all in only one.
          //writes speed on sucction
        const s = document.querySelector(".succtionGauge"); //gauge of the sucction pipe
        const pSuccion = document.getElementById("succtionSpeed");
        const selectedGaugeSuccion = ((s.options[s.selectedIndex].value*1)/1000).toFixed(5);
        const middleFormulaSuccion = Math.pow(selectedGaugeSuccion,2).toFixed(5);
        const middleFormulaPowSuccion = (3.14*middleFormulaSuccion).toFixed(5) 

        const flowSpeedSuccion = (flowPerSecond/(middleFormulaPowSuccion/4)).toFixed(2);
          if (flowSpeedSuccion > 1.6){
            pSuccion.innerHTML = `${flowSpeedSuccion} m/s. Aumente a bitola. Ideal p/ succção é 1.0 m/s`;
            pSuccion.style.backgroundColor = "red";
          } else if (flowSpeedSuccion > 1.1 && flowSpeedSuccion <=1.6){
            pSuccion.innerHTML = `${flowSpeedSuccion} m/s. Ok. Ideal é 1.0 m/s`;
            pSuccion.style.backgroundColor = "green";

          } else {
            pSuccion.innerHTML = `${flowSpeedSuccion} m/s`;
            pSuccion.style.backgroundColor = "";
          }


      }
      function christiansenFactor(exits){
        const part1 = Math.pow(6*exits,2)
        const part2 = 0.725/part1
        const part3 = 2*exits
        const part4 = 1/(part2+part3)
        const part5 = 0.35+part4
        return part5
        //formula: equation of christiansen = 0.35+(1/(2*#exits)+(0.725/(6*#exits^2)))
      }

      function getPressureLossMainPipe(){
        //mainpipe
        const e = document.querySelector(".pipeGauge"); //main pipe length 
        const pvc = 140;
        const selectedGauge = ((e.options[e.selectedIndex].value*1)/1000).toFixed(5); //main pipe gauge
        const allSectors = ((sprinklerFlow.value/1000/3600) * (qtdSprinkler.value) *(sectorAtOnce.value))*1;
        const pipeLength = (mainPipeLine.value)*1;

        const flowEq = allSectors/pvc; 
        const flowPow = Math.pow(flowEq, 1.85)
        const gaugePow = Math.pow(selectedGauge, 4.87)
        const gaugeEq = 1/gaugePow

        const formula = flowPow * gaugeEq

        const finalResult = 10.641 * formula; //10.641*((Vm/s))

        document.getElementById("pressureLossPipe").innerHTML = `${(finalResult*pipeLength).toFixed(2)} m.c.a`;

        return finalResult*pipeLength;

      }
      function getPressureLossSucction(){
        //sucction
        const x = document.querySelector(".succtionGauge"); //main pipe length 
        const selectedGaugeSuc = ((x.options[x.selectedIndex].value*1)/1000).toFixed(5); //main pipe gauge
        const pvc = 140;
        const allSectors = ((sprinklerFlow.value/1000/3600) * (qtdSprinkler.value) *(sectorAtOnce.value))*1;
        const succiontPipeLength = document.getElementById("succtionH")

        const flowEqSuc = allSectors/pvc; 
        const flowPowSuc = Math.pow(flowEqSuc, 1.85)
        const gaugePowSuc = Math.pow(selectedGaugeSuc, 4.87)
        const gaugeEqSuc = 1/gaugePowSuc

        const formulaSuc = flowPowSuc * gaugeEqSuc

        const finalResultSuc = 10.641 * formulaSuc; //10.641*((Vm/s))

        document.getElementById("succtionPressureLoss").innerHTML = `${(finalResultSuc * (succiontPipeLength.value*1)).toFixed(2)} m.c.a`
        return finalResultSuc * (succiontPipeLength.value*1);
      }

      function getPressureLossEx(){
        //*******************************************************************
        //presure loss on ex        
        const a = document.querySelector(".sectorGauge"); //secotr pipe length
        const selectedGauge = ((a.options[a.selectedIndex].value*1)/1000).toFixed(5);
        const pvc = 140;
        const flow = ((sprinklerFlow.value/1000/3600) * (qtdSprinkler.value) * (sectorAtOnce.value))*1;
        const pipeLength = (sectorLength.value)*1;

        const flowEq = flow/pvc;
        const flowPow = Math.pow(flowEq, 1.85)
        const gaugePow = Math.pow(selectedGauge, 4.87)
        const gaugeEq = 1/gaugePow

        const formula = flowPow * gaugeEq

        const finalResult = 10.641 * formula; //10.641*((Vm/s))
        const pressureLossMultipleExits = finalResult * christiansenFactor(qtdSprinkler.value) * pipeLength;

        document.getElementById("pressureLossSector").innerHTML = `${(pressureLossMultipleExits).toFixed(2)} m.c.a`;

        return pressureLossMultipleExits;
     

      }

      function getTotalPressureLoss(){
        const headPressure = workingPressure.value*1;
        const height = totalSlope.value*1;
        const p = document.getElementById("totalPressureLoss");
        const totalLoss =  (getPressureLossSucction()+getPressureLossEx()+getPressureLossMainPipe()+ height + headPressure).toFixed(2);

        p.innerHTML = `${totalLoss} m.c.a`;
        return totalLoss;

      }

      function getIdealPump(){

        const totalFlow = getFlowSector();
        const totalPressureLoss = getTotalPressureLoss();

        const p = document.getElementById("idealPump");


        p.innerHTML = `Precisa de uma vazão de ${totalFlow/1000} m3 a uma pressão de ${totalPressureLoss}`;

      }