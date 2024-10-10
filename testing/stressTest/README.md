# Stress Testing with JMeter

## Results explanation

![image](https://github.com/user-attachments/assets/be95c9da-c110-4551-9aee-eb3eac27e298)

### High error rates
Some services might seem like they have a high error percentage, but it is only because they
are called statically on deleted or not yet created entries in the database. 

### Max time
Sorting the result by Max time to complete it is apparent that the statistics service is the most time consuming,
which is because every call calculates the entire database, which keeps increasing as more entries are submitted.

### Throughput and Bottlenecks
The throughput column indicates that a possible bottleneck would be because of the Statistics and Solver services,
while the other services seem to be running smoothly.
