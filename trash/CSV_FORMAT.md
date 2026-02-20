# CSV File Format for AI SaaS Companies

## Expected CSV Structure

The chatbot expects a CSV file named **"AI SaaS Biz - Research .csv"** in the `public/` folder.

### Required Columns

The CSV parser is flexible and will look for columns with any of these names (case-insensitive):

#### Company Name
- `Name` or `name`
- `Company` or `company`

#### Domain/Category
- `Domain` or `domain`
- `Category` or `category`
- `Industry` or `industry`

#### Subdomain/Subcategory (Optional)
- `Subdomain` or `subdomain`
- `Subcategory` or `subcategory`
- `Sub-domain`

#### Description (Optional)
- `Description` or `description`
- `Product` or `product`

#### Website URL (Optional)
- `URL` or `url`
- `Website` or `website`

### Example CSV Format

```csv
Name,Domain,Subdomain,Description,URL
HubSpot,Marketing,Email Marketing,All-in-one marketing automation platform,https://hubspot.com
Mailchimp,Marketing,Email Marketing,Email marketing and automation service,https://mailchimp.com
Salesforce,Sales and Customer Support,CRM,Cloud-based CRM platform,https://salesforce.com
Zendesk,Sales and Customer Support,Customer Support,Customer service and support platform,https://zendesk.com
Hootsuite,Social Media,Social Media Management,Social media management platform,https://hootsuite.com
Buffer,Social Media,Social Media Management,Social media scheduling and analytics,https://buffer.com
DocuSign,Legal,Document Management,Electronic signature and document management,https://docusign.com
Greenhouse,HR and talent Hiring,Recruitment,Applicant tracking and recruiting software,https://greenhouse.io
```

### Domain Matching

The chatbot matches companies based on the following domains:

1. **Marketing** (`marketing`)
2. **Sales and Customer Support** (`sales-support`)
3. **Social Media** (`social-media`)
4. **Legal** (`legal`)
5. **HR and talent Hiring** (`hr-hiring`)
6. **Finance** (`finance`)
7. **Supply chain** (`supply-chain`)
8. **Research** (`research`)
9. **Data Analysis** (`data-analysis`)

### How It Works

1. When a user completes the chatbot flow, the system fetches the CSV file
2. Companies are filtered based on the selected domain and subdomain
3. Up to 5 relevant companies are displayed in the market analysis
4. The system provides gap analysis based on the number of competitors found

### Fallback Behavior

If the CSV file is not found or cannot be parsed:
- The chatbot will display: "No specific tools identified in our database yet"
- The system continues to work normally with a fallback message
- Check browser console for any error messages

### Updating the CSV

To update the company database:
1. Edit the CSV file in the `public/` folder
2. Follow the column naming conventions above
3. Redeploy or refresh the application
4. The changes will be reflected immediately in the market analysis
