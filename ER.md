- 認証は個人のみ
- 招待リンクから誰でも参加可能
- 招待コードは変わる（有効期限1時間）
- MVPからは外したけど、後からメンバー追放追加したい（ロール持たせる？）
- 商品カテゴリもMVPからは外したけど、グループごとのカテゴリを持たせるようにしたい

**mermaid表示には拡張機能必要**

### 最低限
```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string password_hash
        datetime created_at
    }

    GROUPS {
        uuid id PK
        string name
        uuid owner_user_id FK
        datetime created_at
    }

    GROUP_MEMBERS {
        uuid id PK
        uuid group_id FK
        uuid user_id FK
        uuid role_id FK
        datetime joined_at
    }

    SPACES {
        uuid id PK
        uuid group_id FK
        string name
        datetime created_at
    }

    ITEMS {
        uuid id PK
        uuid space_id FK
        string name
        boolean is_checked
        uuid created_by_user_id FK
        uuid bought_by_user_id FK
        datetime updated_at
    }

    INVITATIONS {
        uuid id PK
        uuid group_id FK
        string token_hash
        datetime expires_at
        datetime created_at
    }

    USERS ||--o{ GROUP_MEMBERS : joins
    GROUPS ||--o{ GROUP_MEMBERS : has
    GROUPS ||--o{ SPACES : contains
    SPACES ||--o{ ITEMS : contains
    USERS ||--o{ ITEMS : createsBuys
    GROUPS ||--o{ INVITATIONS : issues

```

- メンバー追放機能追加する（ロール持たせる）
- グループごとのカテゴリを持たせるようにしたい

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string password_hash
        datetime created_at
    }

    GROUPS {
        uuid id PK
        string name
        uuid owner_user_id FK
        datetime created_at
    }

    GROUP_MEMBERS {
        uuid id PK
        uuid group_id FK
        uuid user_id FK
        string role FK
        datetime joined_at
    }

    SPACES {
        uuid id PK
        uuid group_id FK
        string name
        datetime created_at
    }

    CATEGORIES {
        uuid id PK
        uuid group_id FK
        string name
        string color
        datetime created_at
    }

    ITEMS {
        uuid id PK
        uuid space_id FK
        uuid category_id FK
        string name
        boolean is_checked
        uuid created_by_user_id FK
        uuid bought_by_user_id FK
        datetime updated_at
    }

    INVITATIONS {
        uuid id PK
        uuid group_id FK
        string code
        datetime expires_at
        datetime created_at
    }

    ROLES {
        uuid role_id PK
        string role_name
    }

    USERS ||--o{ GROUP_MEMBERS : joins
    GROUPS ||--o{ GROUP_MEMBERS : has
    GROUPS ||--o{ SPACES : contains
    GROUPS ||--o{ CATEGORIES : defines
    SPACES ||--o{ ITEMS : contains
    CATEGORIES ||--o{ ITEMS : classifies
    USERS ||--o{ ITEMS : creates
    GROUPS ||--o{ INVITATIONS : issues
    GROUP_MEMBERS ||--|{ ROLES : issues

```