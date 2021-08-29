# Index Analysis

## swsCompany

### Schema

```sql
CREATE TABLE swsCompany
(
	id uniqueidentifier not null primary key,
	name nvarchar(255) not null,
	ticker_symbol nvarchar(255),
	exchange_symbol nvarchar(255),
	unique_symbol nvarchar(255),
	date_generated datetime2(6),
	security_name nvarchar(255),
	exchange_country_iso nvarchar(255),
	listing_currency_iso nvarchar(255),
	canonical_url nvarchar(255),
	unique_symbol_slug nvarchar(255),
    score_id INTEGER REFERENCES swsCompanyScore(id)
);
```

### Queries and Index Analysis

There are two queries targeting this table:

```sql
-- QUERY A
-- getCompany(id: string): Get a company by its ID
SELECT a,b,...,n FROM swsCompany WHERE id = ?
```

`QUERY A` is very fast and efficient as it hits the primary key of the table and fetches a single result. As the query plan shows us:

```sql
sqlite> EXPLAIN QUERY PLAN SELECT name,ticker_symbol FROM swsCompany WHERE id = ?;
QUERY PLAN
`--SEARCH TABLE swsCompany USING INDEX sqlite_autoindex_swsCompany_1 (id=?)
```

it hits the `sqlite_autoindex_swsCompany_1` which is the index created automatically on the table using its primary key.

```sql
-- QUERY B.1 and QUERY B.2
-- getCompanies(afterId: string, limit: int): List companies
SELECT a,b,...,n FROM swsCompany ORDER BY id LIMIT ? -- B.1
SELECT a,b,...,n FROM swsCompany WHERE id > ? ORDER BY id LIMIT ? -- B.2
```

To retrieved list of companies, `QUERY B` is used as a way to retrieve the result fast. This query uses the index to skip the data as opposed to doing `FULL TABLE SCAN` if `OFFSET ? LIMIT ?` was used instead. As the query plan shows us:

```sql
-- B.1
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompany ORDER BY id LIMIT ?;
QUERY PLAN
`--SCAN TABLE swsCompany USING INDEX sqlite_autoindex_swsCompany_1`

-- B.2
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompany WHERE id > ? ORDER BY id LIMIT ?;
QUERY PLAN
`--SEARCH TABLE swsCompany USING INDEX sqlite_autoindex_swsCompany_1 (id>?)`
```

## swsCompanyScore

### Schema

```sql
CREATE TABLE swsCompanyScore
(
	id int identity primary key,
	company_id uniqueidentifier not null,
	date_generated datetime2(6) not null,
	dividend int not null,
	future int not null,
	health int not null,
	management int not null,
	past int not null,
	value int not null,
	misc int not null,
	total int not null,
	sentence nvarchar(255),

    FOREIGN KEY (company_id) REFERENCES swsCompany(id)
);
```

### Queries and Index Analysis

There is only one query targetting this table:

```sql
-- QUERY C
-- getSnowflakeScore(companyId: string): Get snowflake score by its company id
SELECT a,b,...,n FROM swsCompanyScore WHERE company_id = ?
```

There is, however, no index on the `company_id` field by default as it is not the primary key of the table as the query plan shows us, when the query is executed it will scan the whole table:

```sql
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompanyScore WHERE company_id = ?;
QUERY PLAN
`--SCAN TABLE swsCompanyScore
```

To avoid that, a new index namely `swsCompanyScore_company_id` is added by using this statement:

```sql
CREATE INDEX IF NOT EXISTS swsCompanyScore_company_id ON swsCompanyScore (company_id);
```

As a result the query is now very fast since it does index scan instead of full table scan, as the query plan shows us:

```sql
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompanyScore WHERE company_id = ?;
QUERY PLAN
`--SEARCH TABLE swsCompanyScore USING INDEX swsCompanyScore_company_id (company_id=?)
```

## swsCompanyPriceClose

### Schema

```sql
CREATE TABLE swsCompanyPriceClose
(
	date date not null,
	company_id uniqueidentifier not null,
	price float not null,
	date_created datetime2 default CURRENT_TIMESTAMP not null,

	primary key (date, company_id),
    FOREIGN KEY (company_id) REFERENCES swsCompany(id)
);
```

### Queries and Index Analysis

There is only one query targetting this table:

```sql
-- QUERY D
-- getClosingPrices(companyId: string, fromDate: string, toDate: string):
---    Get closing prices from fromDate to toDate

SELECT a,b,...,n FROM swsCompanyPriceClose WHERE company_id = ? AND date >= ? AND date <= ? ORDER BY date DESC
```

As can be seen in the schema above, the primary key of this table is `primary key (date, company_id)`, therefore if we perform `QUERY D` it will use _part_ of the primary key index as shown in the query plan below:

```sql
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompanyPriceClose WHERE company_id = ? AND date >= ? AND date <= ? ORDER BY date DESC;
QUERY PLAN
`--SEARCH TABLE swsCompanyPriceClose USING INDEX sqlite_autoindex_swsCompanyPriceClose_1 (date>? AND date<?)
```

However, the query performance is suboptimal as not all filters are used to skip scanning rows. In this case, only `date` is used to filter the data, as a result the db would still need to scan data from all companies instead of having the index to skip them.

There are two solutions to fix this:

1. Modify the order of the primary key into: `primary key (company_id, date)`.
2. Create a new index: `CREATE INDEX swsCompanyPriceClose_company_date ON swsCompanyPriceClose (company_id, date)`.

The first solution is the fastest as it does not introduce additional index. However, sometimes due to practicallity it is hard to restructure the primary key of the table so creating a new index would make more sense. In this setup, to avoid changing too much of the underlying data, I decided to go with Option 2, which is to create a new index.

As the query plan shows, the index helps making the query faster as it uses all three clause as filter and skipped data from other companies.

```sql
sqlite> EXPLAIN QUERY PLAN SELECT * FROM swsCompanyPriceClose WHERE date >= ? AND date <= ? AND company_id = ? ORDER BY date ASC;
QUERY PLAN
`--SEARCH TABLE swsCompanyPriceClose USING INDEX swsCompanyPriceClose_company_date (company_id=? AND date>? AND date<?)
```
