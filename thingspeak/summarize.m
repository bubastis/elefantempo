% Read temperature data from a ThingSpeak channel over the past 24 hours 
% to calculate the high and low temperatures and write to another channel. 
   
% Replace the [] with channel ID to read data from: 
readChannelID = []; 
   
% Channel Read API Key   
% If your channel is private, then enter the read API Key between the '' below: 
readAPIKey = ''; 
   
% Read temperature data for the last 24 hours from the MathWorks weather 
% station channel. Learn more about the thingSpeakRead function by going to 
% the Documentation tab on the right side pane of this page. 
   
[temp,timeStamp] = thingSpeakRead(readChannelID,'Fields',1,'numDays',1,'ReadKey',readAPIKey); 
[hum,timeStamp] = thingSpeakRead(readChannelID,'Fields',2,'numDays',1,'ReadKey',readAPIKey);
[lux,timeStamp] = thingSpeakRead(readChannelID,'Fields',3,'numDays',1,'ReadKey',readAPIKey);
                                               
display(min(temp),'Min temp is ')
display(mean(temp), 'Avg temp is')
display(max(temp),'Max temp is ')
display(min(hum),'Min hum is ')
display(mean(hum), 'Avg hum is')
display(max(hum),'Max hum is ')
display(mean(lux),'Average lux is ')
display(max(lux), 'Max lux is')

% Calculate the minimum and maximum temperatures 
minTemp = min(temp);
avgTemp = mean(temp);
maxTemp = max(temp); 
% Calculate the minimum and maximum humidity
minHum = min(hum);
avgHum = mean(hum);
maxHum = max(hum); 
% Calculate average lux
avgLux = mean(lux);
maxLux = max(lux);
 
   
% Select the timestamps at which the maximum and minimum temperatures were measured
% timeMinTemp = timeStamp(minTempIndex);
% timeMaxTemp = timeStamp(maxTempIndex);
% timeMinHum = timeStamp(minHumIndex);
% timeMaxHum = timeStamp(maxHumIndex);
% timeMaxLux = timeStamp(maxLuxIndex); 
   
% To store the maximum temperature, write it to a channel other than 
% the one used for reading data. To write to a channel, assign the write 
% channel ID to the 'writeChannelID' variable, and the write API Key to the 
% 'writeAPIKey' variable below. Find the write API Key in the right side pane 
% of this page. 
   
% Replace the [] with channel ID to write data to: 
writeChannelID = ; 
% Enter the Write API Key between the '' below: 
writeAPIKey = ''; 
   
% Learn more about the thingSpeakWrite function by going to the Documentation tab on 
% the right side pane of this page. 

thingSpeakWrite(writeChannelID,'Fields',[1,2,3,4,5,6,7,8],'Values',[minTemp,avgTemp,maxTemp,minHum,avgHum,maxHum,avgLux,maxLux],'WriteKey',writeAPIKey)

