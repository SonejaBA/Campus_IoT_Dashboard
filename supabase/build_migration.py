import os

# Define the exact order files must be executed
BUILD_ORDER = [
    "src/00_create_tables.sql",
    "src/01_rls_enable.sql",
    "src/02_is_admin.sql",
    "src/03_bins_updater.sql",
    "src/04_profile_appender.sql",
    "src/policies/profile_read_access.sql",
    "src/policies/self_profile_updates.sql",
    "src/policies/admin_update_access.sql",
    "src/policies/admin_profile_deleting_access.sql",
    "src/policies/bins_viewing_access.sql",
    "src/policies/admin_bin_access.sql",
    "src/policies/admin_only_view_analytics.sql",
    "src/policies/admin_manual_clear_access.sql",
]

OUTPUT_FILE = "migrations/01_init_schema.sql"

def build():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, OUTPUT_FILE)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as outfile:
        outfile.write("-- AUTO-GENERATED MIGRATION FILE\n")
        outfile.write("-- DO NOT EDIT DIRECTLY. EDIT FILES IN supabase/src/\n\n")

        for relative_path in BUILD_ORDER:
            full_path = os.path.join(base_dir, relative_path)
            if os.path.exists(full_path):
                outfile.write(f"-- ==========================================\n")
                outfile.write(f"-- SOURCE: {relative_path}\n")
                outfile.write(f"-- ==========================================\n")
                with open(full_path, "r", encoding="utf-8") as infile:
                    outfile.write(infile.read().strip() + "\n\n")
            else:
                print(f"Warning: File not found -> {relative_path}")

    print(f"Successfully compiled migration to: {OUTPUT_FILE}")

if __name__ == "__main__":
    build()