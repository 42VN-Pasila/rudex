import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table) => {
        table.boolean('email_confirmed').notNullable().defaultTo(false);
        table.string('confirmation_token').unique();
        table.timestamp('confirmation_token_expires_at', { useTz: true });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('email_confirmed');
        table.dropColumn('confirmation_token');
        table.dropColumn('confirmation_token_expires_at');
    });
}
