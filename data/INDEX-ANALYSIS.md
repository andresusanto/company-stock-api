# Index Analysis

## Schema Definition

### swsCompany

```sql
-- sqlite> .schema swsCompany

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

### swsCompanyScore

```sql
-- sqlite> .schema swsCompanyScore
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

### swsCompanyPriceClose

```sql
-- sqlite> .schema swsCompanyPriceClose
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
