# 1. 2009 년도에 데뷔한 걸그룹 정보를 조회 
SELECT NAME, date_format(debut, '%Y-%m-%d') as debutDate 
    FROM girl_group
    WHERE debut BETWEEN '2009-01-01' AND '2009-12-31'
	ORDER BY debut;

# 2. 2009 년도에 데뷔한 걸그룹의 히트송은 ? (걸그룹 이름, 데뷔일, 히트송)
SELECT g.name AS name,
    date_format(g.debut, '%Y-%m-%d') AS debutDate,
    s.title AS songTitle
    FROM girl_group AS g
    JOIN song AS s ON s.sid = g.hit_song_id
    WHERE debut BETWEEN '2009-01-01' AND '2009-12-31'
    ORDER BY debut;

# 3. 대륙별로 국가숫자, GNP의 합, 평균 국가별 GNP는 ? 
SELECT continent, COUNT(*) AS countCont,
    round(SUM(GNP)) AS sumCont, 
    round(AVG(GNP)) AS avgCont
    FROM country
    GROUP BY continent;;

# 4. 아시아 대륙에서 인구가 가장 많은 도시 10 개를 내림차순으로 보여줄 것 (대륙명, 국가명, 도시명, 인구수)
SELECT country.name AS country,
    city.name AS city,
    city.Population AS population
    FROM country
    JOIN city ON country.code = city.CountryCode
    WHERE continent = 'Asia'
    ORDER BY population DESC
    LIMIT 10;

# 5. 전 세계에서 인구가 가장 많은 10 개 도시에서 사용하는 공식언어는 ? (도시명, 인구수, 언어명)
SELECT city.Name AS name,
    city.Population AS population,
    cl.Language AS language
    FROM city
    JOIN countrylanguage AS cl
    ON city.CountryCode = cl.CountryCode
    WHERE cl.IsOfficial = 'T'
    GROUP BY city.Name
    ORDER BY city.Population DESC
    LIMIT 10;