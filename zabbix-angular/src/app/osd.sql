SELECT 
a.os,b.dist,b.version, a.timestamp,c.name,a.region,COUNT(a.os) as total, 
COUNT(CASE 
    WHEN a.typeis = 'D' THEN 1
    WHEN a.typeis = 'N' THEN 1
	ELSE NULL
END) as physical,
COUNT(CASE 
    WHEN a.typeis = 'V' THEN 1
    WHEN a.typeis = 'S' THEN 1
 	ELSE NULL
END) as virtual
FROM `host` as a
LEFT JOIN `os` as b

ON a.os = b.id

LEFT JOIN `profile` as c

ON c.id = a.profile

WHERE a.timestamp > DATE_SUB(now(), INTERVAL 180 DAY)
GROUP BY a.os,c.name,a.region

ORDER BY a.os



SELECT 
a.os,b.dist,b.version,a.typeis, a.timestamp,c.name,a.region,COUNT(a.os), 
COUNT(CASE 
    WHEN a.typeis = 'D' THEN 1
    WHEN a.typeis = 'N' THEN 1
	ELSE NULL
END) as Physical,
COUNT(CASE 
    WHEN a.typeis = 'V' THEN 1
    WHEN a.typeis = 'S' THEN 1
 	ELSE NULL
END) as Virtual
FROM `host` as a
LEFT JOIN `os` as b
ON a.os = b.id
LEFT JOIN `profile` as c
ON c.id = a.profile
WHERE a.timestamp > DATE_SUB(now(), INTERVAL 180 DAY)
AND a.os = 59
AND c.name = 'Production - HANA-Core'
GROUP BY a.os,c.name,a.region
ORDER BY a.os