-- Create a function to get vote counts for a given event
-- This function aggregates votes without exposing individual user identities
CREATE OR REPLACE FUNCTION get_event_vote_counts(event_id_param TEXT)
RETURNS TABLE (
  yes_count BIGINT,
  no_count BIGINT,
  unsure_count BIGINT,
  total_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN choice = 'yes' THEN 1 END) as yes_count,
    COUNT(CASE WHEN choice = 'no' THEN 1 END) as no_count,
    COUNT(CASE WHEN choice = 'unsure' THEN 1 END) as unsure_count,
    COUNT(*) as total_count
  FROM event_votes 
  WHERE event_id = event_id_param;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_event_vote_counts(TEXT) TO authenticated;

-- Create a more efficient function that returns JSON
CREATE OR REPLACE FUNCTION get_event_vote_counts_json(event_id_param TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'yes', COUNT(CASE WHEN choice = 'yes' THEN 1 END),
    'no', COUNT(CASE WHEN choice = 'no' THEN 1 END),
    'unsure', COUNT(CASE WHEN choice = 'unsure' THEN 1 END),
    'total', COUNT(*)
  ) INTO result
  FROM event_votes 
  WHERE event_id = event_id_param;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_event_vote_counts_json(TEXT) TO authenticated;
