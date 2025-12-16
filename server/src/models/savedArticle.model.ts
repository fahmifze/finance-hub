import pool from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface SavedArticle {
  id: number;
  userId: number;
  articleUuid: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  source: string | null;
  publishedAt: Date;
  categories: string[] | null;
  tickers: string[] | null;
  savedAt: Date;
  isRead: boolean;
}

export interface CreateSavedArticleData {
  userId: number;
  articleUuid: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  source?: string;
  publishedAt: Date;
  categories?: string[];
  tickers?: string[];
}

export async function findAllByUser(
  userId: number,
  options: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  } = {}
): Promise<{
  data: SavedArticle[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const { page = 1, limit = 20, isRead } = options;

  // Build conditions
  const conditions: string[] = ['user_id = ?'];
  const params: (number | boolean)[] = [userId];

  if (isRead !== undefined) {
    conditions.push('is_read = ?');
    params.push(isRead);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const [countResult] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM saved_articles WHERE ${whereClause}`,
    params
  );
  const total = countResult[0].total;

  // Get paginated data
  const offset = (page - 1) * limit;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT
      id,
      user_id as userId,
      article_uuid as articleUuid,
      title,
      description,
      url,
      image_url as imageUrl,
      source,
      published_at as publishedAt,
      categories,
      tickers,
      saved_at as savedAt,
      is_read as isRead
    FROM saved_articles
    WHERE ${whereClause}
    ORDER BY saved_at DESC
    LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    params
  );

  // Parse JSON fields
  const articles = (rows as SavedArticle[]).map((row) => ({
    ...row,
    categories: row.categories ? JSON.parse(row.categories as unknown as string) : null,
    tickers: row.tickers ? JSON.parse(row.tickers as unknown as string) : null,
  }));

  return {
    data: articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findByUserAndUuid(
  userId: number,
  articleUuid: string
): Promise<SavedArticle | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT
      id,
      user_id as userId,
      article_uuid as articleUuid,
      title,
      description,
      url,
      image_url as imageUrl,
      source,
      published_at as publishedAt,
      categories,
      tickers,
      saved_at as savedAt,
      is_read as isRead
    FROM saved_articles
    WHERE user_id = ? AND article_uuid = ?`,
    [userId, articleUuid]
  );

  if (rows.length === 0) return null;

  const row = rows[0] as SavedArticle;
  return {
    ...row,
    categories: row.categories ? JSON.parse(row.categories as unknown as string) : null,
    tickers: row.tickers ? JSON.parse(row.tickers as unknown as string) : null,
  };
}

export async function create(data: CreateSavedArticleData): Promise<SavedArticle> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO saved_articles
      (user_id, article_uuid, title, description, url, image_url, source, published_at, categories, tickers)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.articleUuid,
      data.title,
      data.description || null,
      data.url,
      data.imageUrl || null,
      data.source || null,
      data.publishedAt,
      data.categories ? JSON.stringify(data.categories) : null,
      data.tickers ? JSON.stringify(data.tickers) : null,
    ]
  );

  const article = await findById(result.insertId);
  return article!;
}

export async function findById(id: number): Promise<SavedArticle | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT
      id,
      user_id as userId,
      article_uuid as articleUuid,
      title,
      description,
      url,
      image_url as imageUrl,
      source,
      published_at as publishedAt,
      categories,
      tickers,
      saved_at as savedAt,
      is_read as isRead
    FROM saved_articles
    WHERE id = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  const row = rows[0] as SavedArticle;
  return {
    ...row,
    categories: row.categories ? JSON.parse(row.categories as unknown as string) : null,
    tickers: row.tickers ? JSON.parse(row.tickers as unknown as string) : null,
  };
}

export async function markAsRead(userId: number, articleUuid: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE saved_articles SET is_read = TRUE WHERE user_id = ? AND article_uuid = ?`,
    [userId, articleUuid]
  );

  return result.affectedRows > 0;
}

export async function markAsUnread(userId: number, articleUuid: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE saved_articles SET is_read = FALSE WHERE user_id = ? AND article_uuid = ?`,
    [userId, articleUuid]
  );

  return result.affectedRows > 0;
}

export async function remove(userId: number, articleUuid: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM saved_articles WHERE user_id = ? AND article_uuid = ?`,
    [userId, articleUuid]
  );

  return result.affectedRows > 0;
}

export async function getSavedArticleUuids(userId: number): Promise<string[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT article_uuid as articleUuid FROM saved_articles WHERE user_id = ?`,
    [userId]
  );

  return (rows as { articleUuid: string }[]).map((row) => row.articleUuid);
}

export async function getUnreadCount(userId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM saved_articles WHERE user_id = ? AND is_read = FALSE`,
    [userId]
  );

  return rows[0].count;
}
